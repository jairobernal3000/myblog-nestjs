import { CreatePostDto } from "./create-post.dto";
import {PartialType} from '@nestjs/swagger';

export class EditPostDto extends PartialType(CreatePostDto) {}
