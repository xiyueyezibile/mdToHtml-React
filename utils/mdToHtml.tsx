import { ReactNode } from 'react';

const reg_xx = /\*\*(.+?)\*\*/;
const reg_img = /!\[(.*)\]\((.+?)\)/;
const reg_m = /^\#+/;
const reg_ul = /^[-*]\s+/;
const reg_ol = /^\d+\.\s+/;
const reg_code = /`(.+?)`/;
const reg_a = /\[(.*)\]\((.+?)\)/;
type ItemObjectType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'strong' | 'img' | 'ul' | 'ol' | 'li' | 'code' | 'a';

interface ItemObject {
  type: ItemObjectType;
  value: (ItemObject | string)[];
}
function readSTR(str: ItemObject | string): any {
  if (typeof str === 'string') {
    return str;
  }
  if (str.type === 'code') {
    return (
      <>
        {readSTR(str.value[0])}
        <code>{readSTR(str.value[1])}</code>
        {readSTR(str.value[2])}
      </>
    );
  } else if (str.type === 'strong') {
    return (
      <>
        {readSTR(str.value[0])}
        <strong>{readSTR(str.value[1])}</strong>
        {readSTR(str.value[2])}
      </>
    );
  } else if (str.type === 'img') {
    return (
      <>
        {readSTR(str.value[0])}
        <img key={readSTR(str.value[2])} src={readSTR(str.value[2])} alt={readSTR(str.value[1])} />
        {readSTR(str.value[3])}
      </>
    );
  } else if (str.type === 'a') {
    return (
      <>
        {readSTR(str.value[0])}
        <a key={readSTR(str.value[2])} href={readSTR(str.value[2])}>
          {readSTR(str.value[1])}
        </a>
        {readSTR(str.value[3])}
      </>
    );
  } else if (str.type === 'h1') {
    return (
      <>
        <h1>{readSTR(str.value[0])}</h1>
      </>
    );
  } else if (str.type === 'h2') {
    return (
      <>
        <h2>{readSTR(str.value[0])}</h2>
      </>
    );
  } else if (str.type === 'h3') {
    return (
      <>
        <h3>{readSTR(str.value[0])}</h3>
      </>
    );
  } else if (str.type === 'h4') {
    return (
      <>
        <h4>{readSTR(str.value[0])}</h4>
      </>
    );
  } else if (str.type === 'h5') {
    return (
      <>
        <h5>{readSTR(str.value[0])}</h5>
      </>
    );
  } else if (str.type === 'ul') {
    return (
      <>
        <ul>
          {str.value.map((item, index) => (
            <li key={index}>{readSTR(item) as ReactNode}</li>
          ))}
        </ul>
      </>
    );
  } else if (str.type === 'ol') {
    return (
      <>
        <ol>
          {str.value.map((item, index) => (
            <li key={index}>{readSTR(item) as ReactNode}</li>
          ))}
        </ol>
      </>
    );
  }
}
function readSTRArr(data: any[] | string): any {
  if (typeof data === 'string') {
    return data;
  }
  const node = data.map((item) => {
    return readSTR(item[0]);
  });
  return node;
}

function judgeSTRArr(data: string[]): (ItemObject | string)[] {
  let beforeType = '';
  let beforeIndex = 0;
  let newdata = [];
  for (let i = 0; i < data.length; i++) {
    const dataItem = judgeSTR(data[i], beforeType);
    if (beforeType === 'ul' && dataItem[0].type === 'li') {
      newdata[beforeIndex][0].value.push(...dataItem[0].value);
    } else if (beforeType === 'ol' && dataItem[0].type === 'li') {
      newdata[beforeIndex][0].value.push(...dataItem[0].value);
    } else {
      beforeType = dataItem[0].type;
      if (beforeType === 'ul') {
        beforeIndex = newdata.length;
      } else if (beforeType === 'ol') {
        beforeIndex = newdata.length;
      }
      newdata.push(dataItem);
    }
  }
  return newdata;
}
function judgeSTR(str: string, beforeType?: string, type?: ItemObjectType): any {
  const data: { type: string; value: any[] }[] = [];

  if (reg_m.test(str)) {
    for (let i = 0; i < str.length; i++) {
      if (str.slice(0, i) === '# ') {
        data.push({ type: 'h1', value: [...judgeSTR(str.slice(i), undefined, 'h1')] });
      } else if (str.slice(0, i) === '## ') {
        data.push({ type: 'h2', value: [...judgeSTR(str.slice(i), undefined, 'h2')] });
      } else if (str.slice(0, i) === '### ') {
        data.push({ type: 'h3', value: [...judgeSTR(str.slice(i), undefined, 'h3')] });
      } else if (str.slice(0, i) === '#### ') {
        data.push({ type: 'h4', value: [...judgeSTR(str.slice(i), undefined, 'h4')] });
      } else if (str.slice(0, i) === '##### ') {
        data.push({ type: 'h5', value: [...judgeSTR(str.slice(i), undefined, 'h5')] });
      }
    }
  } else if (reg_ul.test(str)) {
    if (type === 'h1' || type === 'h2' || type === 'h3' || type === 'h4' || type === 'h5') {
      return [str];
    }
    if (beforeType !== 'ul') {
      data.push({ type: 'ul', value: judgeSTR(str.slice(2)) });
    } else {
      data.push({ type: 'li', value: judgeSTR(str.slice(2)) });
    }
  } else if (reg_ol.test(str)) {
    if (type === 'h1' || type === 'h2' || type === 'h3' || type === 'h4' || type === 'h5') {
      return [str];
    }
    const matched = str.match(reg_ol) as RegExpMatchArray;

    if (beforeType !== 'ol') {
      data.push({
        type: 'ol',
        value: judgeSTR(str.slice(matched[0].length))
      });
    } else {
      data.push({
        type: 'li',
        value: judgeSTR(str.slice(matched[0].length))
      });
    }
  } // 图片判断
  else if (reg_img.test(str)) {
    data.push({ type: 'img', value: [] });
    let flag = 0;
    let pre = 0;
    let n = 0;
    for (let i = 0; i < str.length; ) {
      if (str.slice(i, i + 2) === '![') {
        data[data.length - 1].value = judgeSTR(str.slice(0, i));
        n = i + 2;
        flag = 1;
      }
      if (str.slice(i, i + 2) === '](' && flag) {
        data[data.length - 1].value = [...data[data.length - 1].value, str.slice(n, i)];
        pre = i + 2;
      }
      if (pre !== 0 && str[i] == ')') {
        data[data.length - 1].value.push(str.slice(pre, i));
        data[data.length - 1].value.push(...judgeSTR(str.slice(i + 1)));
      }
      i++;
    }
  } else if (reg_code.test(str)) {
    data.push({ type: 'code', value: [] });
    let flag = 0;
    let pre = 0;
    for (let i = 0; i < str.length; ) {
      if (str[i] == '`' && flag === 1) {
        data[data.length - 1].value = [
          ...data[data.length - 1].value[0],
          ...judgeSTR(str.slice(pre, i)),
          ...judgeSTR(str.slice(i + 1))
        ];
        // data.push(str.slice(pre, i));
        // data.push(str.slice(i + 2));
        break;
      }
      if (str[i] == '`') {
        data[data.length - 1].value.push([...judgeSTR(str.slice(0, i))]);
        // data.push(str.slice(0, i));
        pre = i + 1;
        flag = 1;
      }
      i++;
    }
  }
  // 加粗判断
  else if (reg_xx.test(str)) {
    data.push({ type: 'strong', value: [] });
    let flag = 0;
    let pre = 0;
    for (let i = 0; i < str.length; ) {
      if (str[i] == '*' && str[i + 1] == '*' && flag === 1) {
        data[data.length - 1].value = [
          ...data[data.length - 1].value[0],
          ...judgeSTR(str.slice(pre, i)),
          ...judgeSTR(str.slice(i + 2))
        ];
        // data.push(str.slice(pre, i));
        // data.push(str.slice(i + 2));
        break;
      }
      if (str[i] == '*' && str[i + 1] == '*') {
        data[data.length - 1].value.push([...judgeSTR(str.slice(0, i))]);
        // data.push(str.slice(0, i));
        pre = i + 2;
        flag = 1;
        i += 2;
        continue;
      }
      i++;
    }
  } else if (reg_a.test(str)) {
    data.push({ type: 'a', value: [] });
    let flag = 0;
    let pre = 0;
    let n = 0;
    for (let i = 0; i < str.length; ) {
      if (str[i] === '[') {
        data[data.length - 1].value = judgeSTR(str.slice(0, i));
        n = i + 1;
        flag = 1;
      }
      if (str.slice(i, i + 2) === '](' && flag) {
        data[data.length - 1].value = [...data[data.length - 1].value, str.slice(n, i)];
        pre = i + 2;
      }
      if (pre !== 0 && str[i] == ')') {
        data[data.length - 1].value.push(str.slice(pre, i));
        data[data.length - 1].value.push(...judgeSTR(str.slice(i + 1)));
      }
      i++;
    }
  }

  if (data.length) {
    return data;
  } else {
    return [str];
  }
}
export default function mdToHtml(content: string) {
  let data: any[] = content.replace(/<br>/g, '\n').split('\n');
  data = judgeSTRArr(data);
  return readSTRArr(data).map((item: any) => (
    <>
      {item}
      <br></br>
    </>
  ));
}
