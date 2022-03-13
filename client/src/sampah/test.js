const list = [
  {
    title: "The Big Bang may be a black hole inside another universe",
    imglink:
      "https://images.unsplash.com/photo-1539321908154-04927596764d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1655&q=80",
    tag: "Space",
  },
  {
    title: "The Dark Forest Theory of the Universe",
    imglink: "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg",
    tag: "Wild",
  },
  {
    title: "Is the Universe Real? And Experiment Towards",
    imglink: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
    tag: "Philosophy",
  },
  {
    title: "Mock 41",
    imglink: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
    tag: "Philosophy",
  },
  {
    title: "The Big Bang may be a black hole inside another universe kedua",
    imglink:
      "https://images.unsplash.com/photo-1539321908154-04927596764d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1655&q=80",
    tag: "Space",
  },
  {
    title: "The Dark Forest Theory of the Universe kedua",
    imglink: "https://miro.medium.com/max/1944/1*aLGt-w4m0dhJpAP6K4Abqg.jpeg",
    tag: "Wild",
  },
  {
    title: "Is the Universe Real? And Experiment Towards kedua",
    imglink: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
    tag: "Philosophy",
  },
  {
    title: "Mock 42",
    imglink: "https://miro.medium.com/max/1200/1*zHHvldZopy8y1YcKYez57Q.jpeg",
    tag: "Philosophy",
  },
];
// const half = Math.ceil(list.length / 2);

const firstHalf = list.slice(0, list.length / 2);
const secondHalf = list.slice(-list.length / 2);

console.log(firstHalf);
console.log(secondHalf);
