import { expect, test } from 'vitest';
import mdToHtml from '../utils/mdToHtml';
import React from 'react';
test('测试h1', () => {
  // expect(1).toBe(2);
  const h1 = mdToHtml('# nihao');
  expect(h1).toMatchInlineSnapshot(`
    [
      <React.Fragment>
        <React.Fragment>
          <h1>
            nihao
          </h1>
        </React.Fragment>
        <br />
      </React.Fragment>,
    ]
  `);
});
test('测试strong', () => {
  const strong = mdToHtml('asf**asd**ass');
  expect(strong).toMatchInlineSnapshot(`
    [
      <React.Fragment>
        <React.Fragment>
          asf
          <strong>
            asd
          </strong>
          ass
        </React.Fragment>
        <br />
      </React.Fragment>,
    ]
  `);
});
test('测试无序列表和有序列表', () => {
  const ul = mdToHtml('* asdcjk\n- qweqre');
  expect(ul).toMatchInlineSnapshot(`
    [
      <React.Fragment>
        <React.Fragment>
          <ul>
            <li>
              asdcjk
            </li>
            <li>
              qweqre
            </li>
          </ul>
        </React.Fragment>
        <br />
      </React.Fragment>,
    ]
  `);
});
test('测试img', () => {
  const img = mdToHtml('qw![qq](xsa)fc');
  expect(img).toMatchInlineSnapshot(`
    [
      <React.Fragment>
        <React.Fragment>
          qw
          <img
            alt="qq"
            src="xsa"
          />
          fc
        </React.Fragment>
        <br />
      </React.Fragment>,
    ]
  `);
});
test('测试code', () => {
  const code = mdToHtml('asd`qwrqwr`ascas');
  expect(code).toMatchInlineSnapshot(`
    [
      <React.Fragment>
        <React.Fragment>
          asd
          <code>
            qwrqwr
          </code>
          ascas
        </React.Fragment>
        <br />
      </React.Fragment>,
    ]
  `);
});
test('测试a', () => {
  const a = mdToHtml('qwrqw[asdas](qrqr)');
  expect(a).toMatchInlineSnapshot(`
    [
      <React.Fragment>
        <React.Fragment>
          qwrqw
          <a
            href="qrqr"
          >
            asdas
          </a>
          
        </React.Fragment>
        <br />
      </React.Fragment>,
    ]
  `);
});
test('测试嵌套', () => {
  const m = mdToHtml('# asda**fsf**qwr\n- a![asf](ccc)aaa');
  expect(m).toMatchInlineSnapshot(`
    [
      <React.Fragment>
        <React.Fragment>
          <h1>
            <React.Fragment>
              asda
              <strong>
                fsf
              </strong>
              qwr
            </React.Fragment>
          </h1>
        </React.Fragment>
        <br />
      </React.Fragment>,
      <React.Fragment>
        <React.Fragment>
          <ul>
            <li>
              <React.Fragment>
                a
                <img
                  alt="asf"
                  src="ccc"
                />
                aaa
              </React.Fragment>
            </li>
          </ul>
        </React.Fragment>
        <br />
      </React.Fragment>,
    ]
  `);
});
