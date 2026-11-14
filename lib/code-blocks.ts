import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index';
import { parseFragment, serialize, type DefaultTreeAdapterMap } from 'parse5';

// The same grammars the posts used to load from the CDN: Prism's defaults plus jsx and sql.
// A language without a grammar (cpp) keeps plain text, as it did in the browser.
loadLanguages(['jsx', 'sql']);

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
type ParentNode = DefaultTreeAdapterMap['parentNode'];

const LANG = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
const LANG_ALL = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/gi;

const isElement = (node: Node): node is Element => 'tagName' in node;
const getAttr = (el: Element, name: string) => el.attrs.find(a => a.name === name)?.value;

function setAttr(el: Element, name: string, value: string) {
  const attr = el.attrs.find(a => a.name === name);
  if (attr) attr.value = value;
  else el.attrs.push({ name, value });
}

function languageOf(el: Element | null): string | undefined {
  for (let node: Element | null = el; node; node = isElement(node.parentNode as Node) ? (node.parentNode as Element) : null) {
    const match = LANG.exec(getAttr(node, 'class') ?? '');
    if (match) return match[1].toLowerCase();
  }
  return undefined;
}

function setLanguage(el: Element, language: string) {
  const classes = (getAttr(el, 'class') ?? '').replace(LANG_ALL, '').split(/\s+/).filter(Boolean);
  if (!classes.includes(`language-${language}`)) classes.push(`language-${language}`);
  setAttr(el, 'class', classes.join(' '));
}

function textContent(node: Node): string {
  if (node.nodeName === '#text') return (node as DefaultTreeAdapterMap['textNode']).value;
  return 'childNodes' in node ? node.childNodes.map(textContent).join('') : '';
}

function codeElements(node: ParentNode, found: Element[] = []): Element[] {
  for (const child of node.childNodes) {
    if (!isElement(child)) continue;
    if (child.tagName === 'code') found.push(child);
    codeElements(child, found);
  }
  return found;
}

const insidePre = (code: Element) => {
  for (let node = code.parentNode as Node | null; node && isElement(node); node = node.parentNode as Node | null) {
    if (node.tagName === 'pre') return true;
  }
  return false;
};

/**
 * Does at build time what Prism.highlightAll() and the old blog/post.js did in the browser:
 * highlight each language-tagged <code>, tag its <pre>, and wrap the <pre> with a Copy button.
 */
export function renderCodeBlocks(bodyHtml: string): string {
  const fragment = parseFragment(bodyHtml);
  const codes = codeElements(fragment);
  for (const code of codes) {
    const language = languageOf(code);
    if (!language) continue;
    setLanguage(code, language);
    const pre = code.parentNode as Element;
    const inPre = isElement(pre as Node) && pre.tagName === 'pre';
    if (inPre) {
      setLanguage(pre, language);
      if (getAttr(pre, 'tabindex') === undefined) setAttr(pre, 'tabindex', '0');
    }

    const source = textContent(code);
    if (source) {
      const grammar = Prism.languages[language];
      const html = grammar ? Prism.highlight(source, grammar, language) : Prism.util.encode(source) as string;
      code.childNodes = parseFragment(html).childNodes;
      for (const child of code.childNodes) child.parentNode = code;
    }
  }

  for (const code of codes.filter(insidePre)) {
    const pre = code.parentNode as Element;
    const wrapper = parseFragment('<div class="code-block-wrapper"><button class="copy-button" type="button">Copy</button></div>')
      .childNodes[0] as Element;
    const parent = pre.parentNode as ParentNode;
    parent.childNodes[parent.childNodes.indexOf(pre)] = wrapper;
    wrapper.parentNode = parent;
    wrapper.childNodes.unshift(pre);
    pre.parentNode = wrapper;
  }
  return serialize(fragment);
}
