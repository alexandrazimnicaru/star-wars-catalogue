const renderTitle = (parent, title) => {
  if (!title) {
    return parent;
  }

  const header = document.createElement('header'); 
  const h4 = document.createElement('h4');
  h4.textContent = title;
  header.appendChild(h4);
  parent.appendChild(header);
  return parent;
};

const getClassNameByKey = (str) => (
  str.toLowerCase().trim().split(/\s+/).join('-')
);

const renderList = (parent, listMap) => {
  if (!listMap) {
    return parent;
  }

  const listKeys = Object.keys(listMap);
  if (!listKeys.length) {
    return parent;
  }

  const ul = document.createElement('ul');
  ul.classList.add('item__list');
  listKeys.forEach((key) => {
    const li = document.createElement('li');
    li.classList.add(`item__${getClassNameByKey(key)}`);
    li.textContent = `${key}: ${listMap[key]}`;
    ul.appendChild(li);
  });
  parent.appendChild(ul);
  return parent;
};

const renderButton = (parent, dataAttrs = {}, title = 'Read more', customClass='') => {
  const btn = document.createElement('button');
  const btnText = document.createTextNode(title);

  if (customClass) {
    btn.classList.add('button',  customClass);
  } else {
    btn.classList.add('button');
  }

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
  const section = document.createElement('section');
  section.classList.add('item');
  return renderList(renderTitle(section, title), listItems);
};

export const renderItemWithReadMore = (title, listItems, btnAttrs = {}, customClass='') => {
  return renderButton(renderItem(title, listItems), btnAttrs, 'Read More', customClass);
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
