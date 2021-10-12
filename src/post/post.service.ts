import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto, EditPostDto } from './dtos';
import { Post } from './entities';
import { User } from '../user/entities';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getMany(): Promise<Post[]> {
    return await this.postRepository.find();
  }
  async getOne(id: number) {
    const post = await this.postRepository.findOne(id);
    if (!post) throw new NotFoundException();
    return post;
  }
  async getById(id: number, author?: User) {
    const post = await this.postRepository
      .findOne(id)
      .then((p) => (!author ? p : !!p && author.id === p.author.id ? p : null));
    if (!post)
      throw new NotFoundException('Post does not exist or unauthorized');
    return post;
  }
  async createOne(dto: CreatePostDto, author: User) {
    // @ts-ignore
    const post = this.postRepository.create({ ...dto, author });
    return await this.postRepository.save(post);
  }
  async editOne(id: number, dto: EditPostDto, author?: User) {
    const post = await this.getById(id, author);
    const editedPost = Object.assign(post, dto);
    // @ts-ignore
    return await this.postRepository.save(editedPost);
  }
  async deleteOne(id: number, author?: User) {
    const post = await this.getById(id, author);
    // @ts-ignore
    return await this.postRepository.remove(post);
  }
}
