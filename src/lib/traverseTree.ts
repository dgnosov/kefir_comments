import {IComment} from "src/services/Comments";

/**
 * 1. We need first cicle to create and object with comment id and index. Also
 *    we create a new array inside comments to put child comments
 *
 * 2. The second cicle to fill comment's replies array
 *
 * @param arr
 * @returns IComment[]
 */

const traverseTree = (arr: IComment[]): IComment[] => {
    let map: any = {},
        node,
        res = [],
        i;
    for (i = 0; i < arr.length; i += 1) {
        map[arr[i].id] = i;
        arr[i].replies = [];
    }
    for (i = 0; i < arr.length; i += 1) {
        node = arr[i];
        if (node.parent) {
            arr[map[node.parent]].replies.push(node as never);
        } else {
            res.push(node);
        }
    }
    return res;
};

export default traverseTree;
