const renderTitle = (parent, title) => {
  if (!title) {
    return parent;
  }

  const header = document.createElement('header'); 
  header.textContent = title;
  parent.appendChild(header);
  return parent;
};

const renderList = (parent, listMap) => {
  if (!listMap) {
    return parent;
  }

  const listKeys = Object.keys(listMap);
  if (!listKeys.length) {
    return parent;
  }

  const ul = document.createElement('ul');
  listKeys.forEach((key) => {
    const li = document.createElement('li');
    li.textContent = `${key}: ${listMap[key]}`;
    ul.appendChild(li);
  });
  parent.appendChild(ul);
  return parent;
};

const renderButton = (parent, dataAttrs = {}, title = 'Read more') => {
  const btn = document.createElement('button');
  const btnText = document.createTextNode(title);
  btn.appendChild(btnText);

  if (typeof dataAttrs === 'object' && dataAttrs !== null) {
    Object.keys(dataAttrs).forEach((key) => {
      btn.setAttribute(`data-${key}`, dataAttrs[key]);
    })
  }

  parent.appendChild(btn);
  return parent;
};

export const renderItem = (title, listItems) => {
  const li = document.createElement('li');
  return renderList(renderTitle(li, title), listItems);
};

export const renderItemWithReadMore = (title, listItems, btnAttrs = {}) => {
  return renderButton(renderItem(title, listItems), btnAttrs);
};

export const renderBtnList = (parent, btns = []) => {
  if (!btns || !btns.length) {
    return parent;
  }

  const ul = document.createElement('ul');
  btns.forEach((btn) => {
    const li = document.createElement('li');
    ul.appendChild(renderButton(li, btn.attrs, btn.title))
  });
  parent.appendChild(ul);
  return parent;
}

export const renderRelatedItems = (title, btns) => {
  let wrapper = document.createElement('section');
  return renderBtnList(renderTitle(wrapper, title), btns);
};
