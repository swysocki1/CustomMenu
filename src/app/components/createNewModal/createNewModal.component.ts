import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../models/user.model';
import {LoginService} from '../../service/login.service';
import {ValidationService} from '../../service/validation.service';
declare var $: any;

@Component({
  selector: 'app-modal',
  templateUrl: './createNewModal.component.html'
})
export class CreateNewModalComponent implements OnInit, OnChanges {
  constructor(private vs: ValidationService, private fb: FormBuilder) {}
  @Input() modalId: string;
  @Input() title: string;
  @Input() editObj: any;
  @Input() priceRequired: boolean;
  @Output() createObj = new EventEmitter();
  @Output() updateObj = new EventEmitter();
  modal: FormGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    price: new FormControl()
  });
  errorMessage = '';
  ngOnInit() {
    this.loadForm();
  }
  loadForm() {
    let newObj = {
      name: '',
      description: '',
      price: 0
    };
    if (this.editObj) {
      newObj = {... this.editObj};
    }
    this.modal = this.fb.group({
      name: [newObj.name, Validators.required],
      description: [newObj.description, Validators.required],
      price: [newObj.price]
    });
  }
  onSubmit() {
    this.errorMessage = '';
    const newObj = {
      name: this.modal.value.name,
      description: this.modal.value.description,
      price: this.modal.value.price
    };
    newObj['name'] = this.modal.value.name;
    newObj['description'] = this.modal.value.description;
    newObj['price'] = this.modal.value.price;
    if (this.editObj) {
      this.updateObj.emit(newObj);
    } else {
      this.createObj.emit(newObj);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.editObj && changes.editObj.currentValue !== changes.editObj.previousValue) {
      this.loadForm();
    }
  }
}
