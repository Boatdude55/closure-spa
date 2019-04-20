/*
 * Copyright 2015 Google Inc.
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

package com.google.template.soy.msgs.restricted;

import static com.google.common.truth.Truth.assertThat;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import com.google.template.soy.base.SourceLocation;
import com.google.template.soy.msgs.SoyMsgBundle;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/**
 * Unit tests for SoyMsgBundle.
 *
 */
@RunWith(JUnit4.class)
public class SoyMsgBundleImplTest {

  @Test
  public void testBasic() {

    List<SoyMsg> inMsgs = Lists.newArrayList();
    SourceLocation source1 = new SourceLocation("/path/to/source1", 10, 1, 10, 10);
    inMsgs.add(
        SoyMsg.builder()
            .setId(0x123)
            .setLocaleString("x-zz")
            .setDesc("Boo message.")
            .setSourceLocation(source1)
            .setParts(ImmutableList.<SoyMsgPart>of(SoyMsgRawTextPart.of("Boo!")))
            .build());
    inMsgs.add(
        SoyMsg.builder()
            .setId(0xABC)
            .setLocaleString("x-zz")
            .setMeaning("abc")
            .setDesc("")
            .setIsHidden(true)
            .setContentType("text/html")
            .setParts(
                ImmutableList.<SoyMsgPart>of(
                    SoyMsgRawTextPart.of("Hello, "),
                    new SoyMsgPlaceholderPart("NAME", /* placeholderExample= */ null),
                    SoyMsgRawTextPart.of("!")))
            .build());
    SourceLocation source2 = new SourceLocation("/path/to/source2", 20, 1, 20, 10);
    inMsgs.add(
        SoyMsg.builder()
            .setId(0x123)
            .setLocaleString("x-zz")
            .setDesc("Boo message 2.")
            .setIsHidden(false)
            .setSourceLocation(source2)
            .setParts(ImmutableList.<SoyMsgPart>of(SoyMsgRawTextPart.of("Boo 2!")))
            .build());
    SoyMsgBundle msgBundle = new SoyMsgBundleImpl("x-zz", inMsgs);

    assertThat(msgBundle.getLocaleString()).isEqualTo("x-zz");
    assertThat(msgBundle.isRtl()).isFalse();
    assertThat(msgBundle).hasSize(2);

    List<SoyMsg> outMsgs = Lists.newArrayList();
    for (SoyMsg msg : msgBundle) {
      outMsgs.add(msg);
    }
    assertThat(outMsgs).hasSize(2);

    SoyMsg booMsg = msgBundle.getMsg(0x123);
    assertThat(outMsgs.get(0)).isEqualTo(booMsg);
    assertThat(booMsg.getId()).isEqualTo(0x123);
    assertThat(booMsg.getLocaleString()).isEqualTo("x-zz");
    assertThat(booMsg.getMeaning()).isEqualTo(null);
    assertThat(booMsg.getDesc()).isEqualTo("Boo message.");
    assertThat(booMsg.isHidden()).isFalse();
    assertThat(booMsg.getContentType()).isEqualTo(null);
    assertThat(booMsg.getSourceLocations()).hasSize(2);
    assertThat(booMsg.getSourceLocations()).containsExactly(source1, source2);
    List<SoyMsgPart> booMsgParts = booMsg.getParts();
    assertThat(booMsgParts).hasSize(1);
    assertThat(((SoyMsgRawTextPart) booMsgParts.get(0)).getRawText()).isEqualTo("Boo!");

    SoyMsg helloMsg = msgBundle.getMsg(0xABC);
    assertThat(outMsgs.get(1)).isEqualTo(helloMsg);
    assertThat(helloMsg.getId()).isEqualTo(0xABC);
    assertThat(helloMsg.getLocaleString()).isEqualTo("x-zz");
    assertThat(helloMsg.getMeaning()).isEqualTo("abc");
    assertThat(helloMsg.getDesc()).isEmpty();
    assertThat(helloMsg.isHidden()).isTrue();
    assertThat(helloMsg.getContentType()).isEqualTo("text/html");
    assertThat(helloMsg.getSourceLocations()).isEmpty();
    List<SoyMsgPart> helloMsgParts = helloMsg.getParts();
    assertThat(helloMsgParts).hasSize(3);
    assertThat(((SoyMsgRawTextPart) helloMsgParts.get(0)).getRawText()).isEqualTo("Hello, ");
    assertThat(((SoyMsgPlaceholderPart) helloMsgParts.get(1)).getPlaceholderName())
        .isEqualTo("NAME");
    assertThat(((SoyMsgRawTextPart) helloMsgParts.get(2)).getRawText()).isEqualTo("!");
  }

  @Test
  public void testIsRtl() {
    assertThat(new SoyMsgBundleImpl("ar", ImmutableList.<SoyMsg>of()).isRtl()).isTrue();
    assertThat(new SoyMsgBundleImpl("iw", ImmutableList.<SoyMsg>of()).isRtl()).isTrue();
    assertThat(new SoyMsgBundleImpl("fr", ImmutableList.<SoyMsg>of()).isRtl()).isFalse();
    assertThat(new SoyMsgBundleImpl("en", ImmutableList.<SoyMsg>of()).isRtl()).isFalse();
  }
}
