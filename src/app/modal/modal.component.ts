import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Lesson} from '../lesson/lesson.component';
import {LocalStoreService} from '../local.store.service';
import * as moment from 'moment';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [LocalStoreService]
})
export class ModalComponent{

  constructor( private localStoreService: LocalStoreService) {}
  dateString: string;
  createdLesson: Lesson = new Lesson('', '', moment().format('DD/MM/YYYY'), '');
  @Output() addingEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<boolean>();
  @Input() lessonId;

  onDateUpdate(date: string): void {
    this.dateString = date;
  }
  add(lesson){
    try {
       const data = this.localStoreService.get('lessons');
       for (const item of data){
         if (+item.id >= +this.lessonId){
           this.lessonId = +item.id + 1;
         }
       }
       this.createdLesson = new Lesson(this.lessonId, lesson.topic,
          moment(this.dateString, 'DDMMYYYY').format('DD/MM/YYYY'), lesson.lecturer);
       this.addingEvent.emit(this.createdLesson);
    } catch (e) {
      console.error('ERROR in add function', e);
    }
  }

  cancel() {
    try {
      this.createdLesson = null;
      this.cancelEvent.emit();
    } catch (e) {
      console.error('ERROR in cancel function', e);
    }
  }
}
