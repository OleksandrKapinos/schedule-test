import {Component, OnInit, AfterViewChecked} from '@angular/core';
import { ChangeDetectorRef} from '@angular/core';
import {TemplateRef, ViewChild} from '@angular/core';
import {LocalStoreService} from '../local.store.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

export class Lesson {
  constructor(
    public id: string,
    public topic: string,
    public date: any,
    public lecturer: string,
  ) {
  }
}

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  providers: [LocalStoreService]
})
export class LessonComponent implements OnInit, AfterViewChecked {
  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;


  constructor(private localStoreService: LocalStoreService, private changeDetectorRef: ChangeDetectorRef) {
  }

  lessons: Lesson[] = [];
  editedLesson: Lesson;
  addNew = false;
  lessonId: string;

  // add new lesson
  onAdding(lesson) {
    this.localStoreService.create('lessons', lesson);
    this.load();
    this.add();
  }

  // cancel create new lesson
  onCancel() {
    this.addNew = !this.addNew;
  }

  // loading lessons
  load() {
    const data = this.localStoreService.get('lessons');
    if (data === null){
      this.localStoreService.set('lessons', this.lessons);
    }else {
      this.lessons = data;
    }
  }

  // edit lesson
  edit(lesson: Lesson) {
    try {
      this.editedLesson = new Lesson(lesson.id, lesson.topic, lesson.date, lesson.lecturer);
    } catch (e) {
      console.error('ERROR in edit ', e);
    }
  }

  // delete lesson
  delete(lesson: Lesson) {
    try {
      this.localStoreService.delete('lessons', lesson);
      this.load();
    } catch (e) {
      console.error('ERROR in delete ', e);
    }
  }

  // add lesson
  add() {
    this.lessonId = `${this.lessons.length + 1}`;
    this.addNew = !this.addNew;
  }

  // save lesson
  save(lesson) {
    try {
      this.localStoreService.update('lessons', lesson);
      this.load();
      this.editedLesson = null;
    } catch (e) {
      console.error('ERROR in add ', e);
    }
  }

  // cancel of editing
  cancel() {
    this.editedLesson = null;
  }

  // chose template
  loadTemplate(lesson: Lesson) {
    try {
      if (this.editedLesson && this.editedLesson.id === lesson.id) {
        return this.editTemplate;
      } else {
        return this.readOnlyTemplate;
      }
    } catch (e) {
      console.error('ERROR in loadTemplate ', e);
    }
  }

  drop(event: CdkDragDrop<any>){
    moveItemInArray(this.lessons, event.previousIndex, event.currentIndex);
    this.localStoreService.set('lessons', this.lessons);
  }

  ngOnInit(): void {
    this.load();
  }
  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }
}
