import {Post} from "../post.model";

export class ReturnPostDto {
    id;
    title;
    content;
    image;
    userId;
    createdAt;
    updatedAt;
    author;
    constructor(post: Post) {
        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.image = post.image;
        this.userId = post.userId;
        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
        this.author = post.author.userName;
    }
}