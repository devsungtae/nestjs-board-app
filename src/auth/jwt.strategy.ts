import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as config from 'config';

@Injectable()   // 다른 곳에서도 사용하기 위함
export class JwtStrategy extends PassportStrategy(Strategy) {  // jwt strategy 사용
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository  // 토큰이 유효한지 확인
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { username } = payload;
        const user: User = await this.userRepository.findOne({ username })

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

}