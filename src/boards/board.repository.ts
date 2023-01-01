import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { BoardStatus } from "./board-status.enum";
import { Board } from './board.entity';
import { CreateBoardDto } from "./dto/create-board.dto";

@EntityRepository(Board)   // EntityRepository 대신 CustomRepository 사용
export class BoardRepository extends Repository<Board> {
    
    async createBoard(CreateBoardDto: CreateBoardDto, user: User) : Promise<Board> {
        const {title, description} = CreateBoardDto;

        const board = this.create({
            title, 
            description,
            status: BoardStatus.PUBLIC, 
            user
        })

        await this.save(board); // save 메소드: db에 저장
        return board; // 
    }
}