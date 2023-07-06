const reg_xx = /\*\*(.+?)\*\*/;
const reg_img = /!\[(.*)\]\((.+?)\)/;
const reg_m = /^#+/;
interface ItemObject {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "strong" | "img";
  value: (ItemObject | string)[];
}
function readSTR(str: ItemObject | string): any {
  if (typeof str === "string") {
    return str;
  }
  if (str.type === "strong") {
    return (
      <>
        {readSTR(str.value[0])}
        <strong>{readSTR(str.value[1])}</strong>
        {readSTR(str.value[2])}
      </>
    );
  } else if (str.type === "img") {
    console.log(str.value);

    return (
      <>
        {readSTR(str.value[0])}
        <img
          key={readSTR(str.value[2])}
          src={readSTR(str.value[2])}
          alt={readSTR(str.value[1])}
        />
        {readSTR(str.value[3])}
      </>
    );
  } else if (str.type === "h1") {
    return (
      <>
        <h1>{readSTR(str.value[0])}</h1>
      </>
    );
  } else if (str.type === "h2") {
    return (
      <>
        <h2>{readSTR(str.value[0])}</h2>
      </>
    );
  } else if (str.type === "h3") {
    return (
      <>
        <h3>{readSTR(str.value[0])}</h3>
      </>
    );
  } else if (str.type === "h4") {
    return (
      <>
        <h4>{readSTR(str.value[0])}</h4>
      </>
    );
  } else if (str.type === "h5") {
    return (
      <>
        <h5>{readSTR(str.value[0])}</h5>
      </>
    );
  }
}
function readSTRArr(data: any[] | string): any {
  if (typeof data === "string") {
    return data;
  }
  const node = data.map((item) => {
    return readSTR(item[0]);
  });
  return node;
}

function judgeSTRArr(data: string[]): (ItemObject | string)[] {
  return data.map((item) => {
    return judgeSTR(item);
  });
}
function judgeSTR(str: string): any {
  const data: { type: string; value: any[] }[] = [];

  if (reg_m.test(str)) {
    for (let i = 0; i < str.length; i++) {
      if (str.slice(0, i) === "# ") {
        data.push({ type: "h1", value: [...judgeSTR(str.slice(i))] });
      } else if (str.slice(0, i) === "## ") {
        data.push({ type: "h2", value: [...judgeSTR(str.slice(i))] });
      } else if (str.slice(0, i) === "### ") {
        data.push({ type: "h3", value: [...judgeSTR(str.slice(i))] });
      } else if (str.slice(0, i) === "#### ") {
        data.push({ type: "h4", value: [...judgeSTR(str.slice(i))] });
      } else if (str.slice(0, i) === "##### ") {
        data.push({ type: "h5", value: [...judgeSTR(str.slice(i))] });
      }
    }
  }
  // 加粗判断
  else if (reg_xx.test(str)) {
    data.push({ type: "strong", value: [] });
    let flag = 0;
    let pre = 0;
    for (let i = 0; i < str.length; ) {
      if (str[i] == "*" && str[i + 1] == "*" && flag === 1) {
        data[data.length - 1].value = [
          ...data[data.length - 1].value[0],
          ...judgeSTR(str.slice(pre, i)),
          ...judgeSTR(str.slice(i + 2)),
        ];
        // data.push(str.slice(pre, i));
        // data.push(str.slice(i + 2));
        break;
      }
      if (str[i] == "*" && str[i + 1] == "*") {
        data[data.length - 1].value.push([...judgeSTR(str.slice(0, i))]);
        // data.push(str.slice(0, i));
        pre = i + 2;
        flag = 1;
        i += 2;
        continue;
      }
      i++;
    }
  }
  // 图片判断
  else if (reg_img.test(str)) {
    data.push({ type: "img", value: [] });
    let flag = 0;
    let pre = 0;
    let n = 0;
    for (let i = 0; i < str.length; ) {
      if (str.slice(i, i + 2) === "![") {
        data[data.length - 1].value = judgeSTR(str.slice(0, i));
        n = i + 2;
        flag = 1;
      }
      if (str.slice(i, i + 2) === "](" && flag) {
        data[data.length - 1].value = [
          ...data[data.length - 1].value,
          str.slice(n, i),
        ];
        pre = i + 2;
      }
      if (pre !== 0 && str[i] == ")") {
        data[data.length - 1].value.push(str.slice(pre, i));
        data[data.length - 1].value.push(...judgeSTR(str.slice(i + 1)));
      }
      i++;
    }
  }

  if (data.length) {
    // for (let i = 0; i < data.length; i++) {
    //   data[i].value = judgeSTR(data[i].value);
    // }
    return data;
  } else {
    return [str];
  }
}
export default function mdToHtml(content: string) {
  let data: any[] = content.replace(/<br>/g, "\n").split("\n");
  data = judgeSTRArr(data);
  return readSTRArr(data).map((item: any) => (
    <>
      {item}
      <br></br>
    </>
  ));
}
