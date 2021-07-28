import { Component, ViewEncapsulation } from '@angular/core';
import bbCodeParser from 'js-bbcode-parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'ssposttp';
  start: number;
  end: number;
  text = '';
  parseText = '';

  constructor() {
    this.getLocalStorage();
    this.parse();
  }

  makeid(length): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  parse(): void {
    const random = this.makeid(5);
    bbCodeParser.setCodes({
      '\\[br\\]': '<br>',

      '\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>',
      '\\[i\\](.+?)\\[/i\\]': '<em>$1</em>',
      '\\[u\\](.+?)\\[/u\\]': '<u>$1</u>',

      '\\[h1\\](.+?)\\[/h1\\]': '<h1>$1</h1>',
      '\\[h2\\](.+?)\\[/h2\\]': '<h2>$1</h2>',
      '\\[h3\\](.+?)\\[/h3\\]': '<h3>$1</h3>',
      '\\[h4\\](.+?)\\[/h4\\]': '<h4>$1</h4>',
      '\\[h5\\](.+?)\\[/h5\\]': '<h5>$1</h5>',
      '\\[h6\\](.+?)\\[/h6\\]': '<h6>$1</h6>',

      '\\[p\\](.+?)\\[/p\\]': '<p>$1</p>',

      '\\[color=(.+?)\\](.+?)\\[/color\\]': '<span style="color: $1">$2</span>',

      '\\[img\\](.+?)\\[/img\\]': '<img src="$1">',
      '\\[img=(.+?)\\]': '<img src="$1">',

      '\\[email\\](.+?)\\[/email\\]': '<a href="mailto:$1">$1</a>',
      '\\[email=(.+?)\\](.+?)\\[/email\\]': '<a href="mailto:$1">$2</a>',

      '\\[url\\](.+?)\\[/url\\]': '<a href="$1">$1</a>',
      '\\[url=(.+?)\\|onclick\\](.+?)\\[/url\\]': '<a onclick="$1">$2</a>',
      '\\[url=(.+?)\\starget=(.+?)\\](.+?)\\[/url\\]':
        '<a href="$1" target="$2">$3</a>',
      '\\[url=(.+?)\\](.+?)\\[/url\\]': '<a href="$1">$2</a>',

      '\\[a=(.+?)\\](.+?)\\[/a\\]': '<a href="$1" name="$1">$2</a>',
      '\n': '<br />',

      '\\[list\\](.+?)\\[/list\\]': '<ul>$1</ul>',
      '\\[\\*\\](.+?)\\[/\\*\\]': '<li>$1</li>',
      // tslint:disable-next-line:max-line-length
      '\\[youtube\\](.+?)\\[/youtube\\]': `<iframe width="560" height="315" src="$1" title="YouTube video player" frameborder="0"></iframe>`,
      '\\[twitter\\](.+?)\\[/twitter\\]':
        '<div class="twitter" link="$1"></div>',
      '\\[size=(.+?)\\](.+?)\\[/size\\]':
        '<span style="font-size: $1px">$2</span>',
      '\\[spoil](.+?)\\[/spoil\\]':
        '<div><button class="spoilbutton btn btn-primary" onclick="spoilButton(this);">SPOIL<input value="' +
        random +
        '" type="hidden"></button><div class="spoilCon spoilId_' +
        random +
        '">$1</div></div>',
    });

    if (this.text) {
      this.parseText = bbCodeParser.parse(bbCodeParser.parse(this.text));
    } else {
      this.parseText = '';
    }
    this.setLocalStorage();
  }


  addTag(tag: string, attr: string = ''): void {
    const { start, end } = this;
    const startTxt = this.text.substring(0, start);
    const endTxt = this.text.substring(end, this.text.length);
    let resultText;
    if (attr === '') {
      resultText = `[${tag}]${this.text.substring(start, end)}[/${tag}]`;
    } else {
      resultText = `[${tag}=${attr}]${this.text.substring(start, end)}[/${tag}]`;
    }
    this.text = `${startTxt}${resultText}${endTxt}`;
    this.parse();
  }

  selectionchange(event: any): void {
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    this.start = start;
    this.end = end;
  }

  setLocalStorage(): void {
    localStorage.setItem('text', this.text);
    localStorage.setItem('parseText', this.parseText);
  }

  getLocalStorage(): void {
    this.text = localStorage.getItem('text');
    this.parseText = localStorage.getItem('parseText');
  }

  clear(): void {
    this.text = '';
    this.parseText = '';
    this.parse();
  }
}
