/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.template.soy.soytree;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;

import com.google.common.base.Joiner;
import com.google.common.collect.Iterables;
import com.google.template.soy.SoyFileSetParserBuilder;
import com.google.template.soy.base.internal.IdGenerator;
import com.google.template.soy.base.internal.IncrementingIdGenerator;
import com.google.template.soy.basetree.CopyState;
import com.google.template.soy.basetree.SyntaxVersion;
import com.google.template.soy.error.ErrorReporter;
import com.google.template.soy.exprtree.AbstractExprNodeVisitor;
import com.google.template.soy.exprtree.ExprNode;
import com.google.template.soy.exprtree.ExprNode.ParentExprNode;
import com.google.template.soy.exprtree.VarDefn;
import com.google.template.soy.exprtree.VarRefNode;
import com.google.template.soy.soytree.SoyNode.StandaloneNode;
import com.google.template.soy.soytree.defn.LocalVar;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/**
 * Unit tests for SoyTreeUtils.
 *
 */
@RunWith(JUnit4.class)
public final class SoyTreeUtilsTest {

  // -----------------------------------------------------------------------------------------------
  // Tests for executing an ExprNode visitor on all expressions in a Soy tree.

  @Test
  public void testVisitAllExprs() {

    String testFileContent =
        "{namespace boo}\n"
            + "\n"
            + "/** @param items */\n"
            + "{template .foo}\n"
            + "  {length($items) + 5}\n" // 5 nodes
            + "  {for $item in $items}\n" // 2 nodes
            + "    {$item.goo}\n" // 3 nodes
            + "  {/for}\n"
            + "{/template}\n";

    ErrorReporter boom = ErrorReporter.exploding();
    SoyFileSetNode soyTree =
        SoyFileSetParserBuilder.forFileContents(testFileContent)
            .errorReporter(boom)
            .parse()
            .fileSet();

    CountingVisitor countingVisitor = new CountingVisitor();
    SoyTreeUtils.execOnAllV2Exprs(soyTree, countingVisitor);
    CountingVisitor.Counts counts = countingVisitor.getCounts();
    assertEquals(3, counts.numExecs);
    assertEquals(10, counts.numVisitedNodes);
  }

  /**
   * Visitor that counts the number of times {@code exec()} is called and the total number of nodes
   * visited over all of those calls.
   *
   * <p>Helper class for {@code testVisitAllExprs()}.
   */
  private static class CountingVisitor extends AbstractExprNodeVisitor<Void> {

    public static class Counts {
      public int numExecs;
      public int numVisitedNodes;
    }

    private final Counts counts = new Counts();

    public Counts getCounts() {
      return counts;
    }

    @Override
    public Void exec(ExprNode node) {
      counts.numExecs++;
      return super.exec(node);
    }

    @Override
    protected void visitExprNode(ExprNode node) {
      counts.numVisitedNodes++;
      if (node instanceof ParentExprNode) {
        visitChildren((ParentExprNode) node);
      }
    }
  }

  // -----------------------------------------------------------------------------------------------
  // Tests for cloning. Adapted from Mike Samuel's CloneVisitorTest.

  private static final String SOY_SOURCE_FOR_TESTING_CLONING =
      Joiner.on('\n')
          .join(
              "{namespace ns}",
              "/** example for cloning. */",
              "{template .ex1 autoescape=\"deprecated-noncontextual\" visibility=\"private\"}",
              "  {@param a : ?}",
              "  {@param b : ?}",
              "  {@param c : ?}",
              "  {@param v : ?}",
              "  {@param x : ?}",
              "  {@param start : ?}",
              "  {@param end : ?}",
              "  {@param cond0 : ?}",
              "  {@param cond1 : ?}",
              "  {@param items : ?}",
              "  {@param world : ?}",
              "  {@param foo : ?}",
              "  Hello, World!",
              "  {lb}{call .foo data=\"all\"}{param x: $x /}{/call}{rb}",
              "  {$x |escapeHtml}",
              "  {if $cond0}",
              "    {$a}",
              "  {elseif $cond1}",
              "    {print $b}",
              "  {else}",
              "    {$c}",
              "  {/if}",
              "  {switch $v}",
              "    {case 0}",
              "      Zero",
              "    {default}",
              "      Some",
              "  {/switch}",
              "  {literal}",
              "     {interpreted literally/}",
              "  {/literal}",
              "  <style>{css($foo, 'bar')} {lb}color: red{rb}</style>",
              "  {msg desc=\"test\"}<h1 class=\"howdy\">Hello, {$world}!</h1>{/msg}",
              "  <ol>",
              "    {for $item in $items}",
              "      <li>{$item}</li>",
              "    {ifempty}",
              "      <li><i>Nothing to see here!",
              "    {/for}",
              "  </ol>",
              "  {let $local : 'foo' /}",
              "  {$local}",
              "{/template}");

  @Test
  public final void testClone() throws Exception {
    SoyFileSetNode soyTree =
        SoyFileSetParserBuilder.forFileContents(SOY_SOURCE_FOR_TESTING_CLONING)
            .declaredSyntaxVersion(SyntaxVersion.V2_4)
            .parse()
            .fileSet();

    SoyFileSetNode clone = soyTree.copy(new CopyState());
    assertEquals(1, clone.numChildren());

    assertEquals(clone.getChild(0).toSourceString(), soyTree.getChild(0).toSourceString());
    // All the localvarnodes, there is one of each type
    ForNonemptyNode forNonemptyNode =
        Iterables.getOnlyElement(SoyTreeUtils.getAllNodesOfType(clone, ForNonemptyNode.class));
    LetValueNode letValueNode =
        Iterables.getOnlyElement(SoyTreeUtils.getAllNodesOfType(clone, LetValueNode.class));
    for (VarRefNode varRef : SoyTreeUtils.getAllNodesOfType(clone, VarRefNode.class)) {
      VarDefn defn = varRef.getDefnDecl();
      LocalVar local;
      switch (varRef.getName()) {
        case "local":
          local = (LocalVar) defn;
          assertSame(letValueNode, local.declaringNode());
          assertSame(letValueNode.getVar(), local);
          break;
        case "item":
          local = (LocalVar) defn;
          assertSame(forNonemptyNode, local.declaringNode());
          assertSame(forNonemptyNode.getVar(), defn);
          break;
        default:
          // fall through
      }
    }
  }

  @Test
  public final void testCloneWithNewIds() throws Exception {

    IdGenerator nodeIdGen = new IncrementingIdGenerator();
    SoyFileSetNode soyTree = new SoyFileSetNode(nodeIdGen.genId(), nodeIdGen);

    SoyFileNode soyFile =
        SoyFileSetParserBuilder.forFileContents(SOY_SOURCE_FOR_TESTING_CLONING)
            .parse()
            .fileSet()
            .getChild(0);
    soyTree.addChild(soyFile);

    SoyFileSetNode clone = SoyTreeUtils.cloneWithNewIds(soyTree, nodeIdGen);
    assertEquals(1, clone.numChildren());

    assertFalse(clone.getId() == soyTree.getId());
    assertEquals(clone.getChild(0).toSourceString(), soyFile.toSourceString());
  }

  @Test
  public final void testCloneListWithNewIds() throws Exception {

    SoyFileNode soyFile =
        SoyFileSetParserBuilder.forFileContents(SOY_SOURCE_FOR_TESTING_CLONING)
            .parse()
            .fileSet()
            .getChild(0);

    TemplateNode template = soyFile.getChild(0);
    int numChildren = template.numChildren();

    List<StandaloneNode> clones =
        SoyTreeUtils.cloneListWithNewIds(
            template.getChildren(), soyFile.getParent().getNodeIdGenerator());
    assertThat(clones).hasSize(numChildren);

    for (int i = 0; i < numChildren; i++) {
      StandaloneNode clone = clones.get(i);
      StandaloneNode child = template.getChild(i);
      assertFalse(clone.getId() == child.getId());
      assertEquals(child.toSourceString(), clone.toSourceString());
    }
  }

  @Test
  public final void testMsgHtmlTagNode() throws Exception {

    SoyFileNode soyFile =
        SoyFileSetParserBuilder.forFileContents(SOY_SOURCE_FOR_TESTING_CLONING)
            .parse()
            .fileSet()
            .getChild(0);

    List<MsgHtmlTagNode> msgHtmlTagNodes =
        SoyTreeUtils.getAllNodesOfType(soyFile, MsgHtmlTagNode.class);

    for (MsgHtmlTagNode origMsgHtmlTagNode : msgHtmlTagNodes) {
      MsgHtmlTagNode clonedMsgHtmlTagNode = origMsgHtmlTagNode.copy(new CopyState());

      assertEquals(clonedMsgHtmlTagNode.numChildren(), origMsgHtmlTagNode.numChildren());
      assertEquals(clonedMsgHtmlTagNode.getId(), origMsgHtmlTagNode.getId());
      assertEquals(clonedMsgHtmlTagNode.getLcTagName(), origMsgHtmlTagNode.getLcTagName());
    }
  }

  @Test
  public final void testBuildAstString() throws Exception {
    String testFileContent =
        "{namespace ns}\n"
            + "\n"
            + "{template .t}\n"
            + "  {@param foo: string}\n"
            + "  {@param bar: string}\n"
            + "  {for $i in range(5)}\n"
            + "    {if $i % 2 == 0}\n"
            + "      {$foo}\n"
            + "    {else}\n"
            + "      {$bar}\n"
            + "    {/if}\n"
            + "  {/for}\n"
            + "  foo\n"
            + "{/template}\n";

    ErrorReporter boom = ErrorReporter.exploding();
    SoyFileSetNode soyTree =
        SoyFileSetParserBuilder.forFileContents(testFileContent)
            .errorReporter(boom)
            .parse()
            .fileSet();

    assertThat(SoyTreeUtils.buildAstString(soyTree, 2, new StringBuilder()).toString())
        .isEqualTo(
            ""
                + "    SOY_FILE_NODE\n"
                + "      TEMPLATE_BASIC_NODE\n"
                + "        FOR_NODE\n"
                + "          FOR_NONEMPTY_NODE\n"
                + "            IF_NODE\n"
                + "              IF_COND_NODE\n"
                + "                PRINT_NODE\n"
                + "              IF_ELSE_NODE\n"
                + "                PRINT_NODE\n"
                + "        RAW_TEXT_NODE\n");
  }
}