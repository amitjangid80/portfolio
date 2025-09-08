import { RouterLink } from '@angular/router';
import { signal, Component, WritableSignal } from '@angular/core';

@Component({
    selector: 'aj-home',
    styleUrl: './home.css',
    templateUrl: './home.html',
    imports: [
        RouterLink
    ]
})
export class Home {
    protected readonly skills: WritableSignal<string[]> = signal([]);
    protected readonly professionSummary: WritableSignal<string[]> = signal([]);

    constructor () {
        this.getProfessionSummary();

        this.getSkills();
    }

    private getProfessionSummary(): void {
        this.professionSummary.set(
            [
                'I have over 9 years of experience in software development. Experienced in designing scalable and high-performance applications across mobile, web, and backend technologies, leveraging Angular, Flutter, Node.js, Golang, Java Spring Boot, and NoSQL databases.',
                'Developed a low code/no-code Angular platform that automates the generation of Java based microservices and UI applications, significantly enhancing development efficiency.',
                'Expertise includes Clean Architecture, CQRS-based backend services in Golang, and dynamic caching mechanisms for WebSocket BFF services.',
                'Lead development teams and collaborate with clients to deliver innovative solutions, optimize performance, and tackle complex engineering challenges.',
            ]
        );
    }

    private getSkills(): void {
        this.skills.set(
            [
                'Angular',
                'TypeScript',
                'Flutter',
                'Dart',
                'Node.js',
                'Express.js',
                'Golang',
                'Java',
                'Spring Boot',
                'MongoDB',
                'Redis',
                'Docker',
                'Kubernetes',
                'AWS',
            ]
        );
    }
}
