import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';
import IconAlt from '../icon-alt.svg';
import { BaseModule } from './BaseModule';

const Parchment = window.Quill.imports.parchment;
const FloatStyle = new Parchment.Attributor.Style('float', 'float');
const MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
const DisplayStyle = new Parchment.Attributor.Style('display', 'display');

export class Toolbar extends BaseModule {
    onCreate = () => {
		// Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

	// The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {};

    _defineAlignments = () => {
        this.alignments = [
            // {
            //     icon: IconAlignLeft,
            //     apply: () => {
            //         DisplayStyle.add(this.img, 'inline');
            //         FloatStyle.add(this.img, 'left');
            //         MarginStyle.add(this.img, '0 1em 1em 0');
            //     },
            //     isApplied: () => FloatStyle.value(this.img) == 'left',
            // },
            // {
            //     icon: IconAlignCenter,
            //     apply: () => {
            //         DisplayStyle.add(this.img, 'block');
            //         FloatStyle.remove(this.img);
            //         MarginStyle.add(this.img, 'auto');
            //     },
            //     isApplied: () => MarginStyle.value(this.img) == 'auto',
            // },
			// {
			// 	icon: IconAlignRight,
			// 	apply: () => {
			// 		DisplayStyle.add(this.img, 'inline');
			// 		FloatStyle.add(this.img, 'right');
			// 		MarginStyle.add(this.img, '0 0 1em 1em');
			// 	},
			// 	isApplied: () => FloatStyle.value(this.img) == 'right',
			// },
			// {
			// 	icon: IconAlt,
			// 	apply: () => {
			// 		const alt = prompt('Введите ALT атрибут для изображения:', this.img.alt);
			// 		if (alt === null) {
			// 			return false;
			// 		} else {
			// 			this.img.alt = alt;
			// 			return true;
			// 		}
			// 	},
			// 	isApplied: () => false,
			// },
        ];
    };

    _addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener('click', () => {
					// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
						// If applied, unapply
					FloatStyle.remove(this.img);
					MarginStyle.remove(this.img);
					DisplayStyle.remove(this.img);
				}				else {
						// otherwise, select button and apply
					this._selectButton(button, idx);
					alignment.apply();
				}
					// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied()) {
					// select button if previously applied
				this._selectButton(button, idx);
			}
			this.toolbar.appendChild(button);
		});
		this._addWideCheckbox();
    };

    _addWideCheckbox = () => {
    	const self = this;

		/**
		 * Add button to call modal;
		 */
		const callModalButton = document.createElement('button');
		callModalButton.type = 'button';
		callModalButton.classList.add('button-open-image-modal');
		callModalButton.textContent = 'Редактировать';

		/**
		 * Add event listener to open modal;
		 */
		callModalButton.addEventListener('click', function() {
			self._openModal();
		});

		/**
		 * Attach button to toolbar;
		 */
		this.toolbar.appendChild(callModalButton);
	};

	/**
	 * Image edit modal;
	 */
	_openModal = () => {
		const self = this;

    	const modal = document.createElement('div');
    	modal.classList.add('image-modal');

    	// Content;
    	const modalContent = document.createElement('div');
		modalContent.classList.add('image-modal__content');

		// Close button;
		const modalCloseButton = document.createElement('button');
		modalCloseButton.type = 'button';
		modalCloseButton.classList.add('image-modal__button-close');
		modalContent.appendChild(modalCloseButton);

		// Title
		const modalTitle = document.createElement('div');
		modalTitle.classList.add('image-modal__title');
		modalTitle.textContent = 'Редактировать изображение';
		modalContent.appendChild(modalTitle);

		// ALT
		const modalInputAltWrapper = document.createElement('div');
		modalInputAltWrapper.classList.add('image-modal__form-group');
		const modalInputAltLabel = document.createElement('label');
		modalInputAltLabel.textContent = 'ALT текст:';
		modalInputAltLabel.setAttribute('for', 'js-image-modal-alt-text');
		const modalInputAlt = document.createElement('input');
		modalInputAlt.type = 'text';
		modalInputAlt.value = this.img.alt;
		modalInputAlt.id = 'js-image-modal-alt-text';
		modalInputAltWrapper.appendChild(modalInputAltLabel);
		modalInputAltWrapper.appendChild(modalInputAlt);
		modalContent.appendChild(modalInputAltWrapper);

		// Description
		const modalInputDescriptionWrapper = document.createElement('div');
		modalInputDescriptionWrapper.classList.add('image-modal__form-group');
		const modalInputDescriptionLabel = document.createElement('label');
		modalInputDescriptionLabel.textContent = 'Описание изображения:';
		modalInputDescriptionLabel.setAttribute('for', 'js-image-modal-description');
		const modalInputDescriptionTextarea = document.createElement('textarea');
		modalInputDescriptionTextarea.value = this.img.getAttribute('data-description');
		modalInputDescriptionTextarea.id = 'js-image-modal-description';
		modalInputDescriptionWrapper.appendChild(modalInputDescriptionLabel);
		modalInputDescriptionWrapper.appendChild(modalInputDescriptionTextarea);
		modalContent.appendChild(modalInputDescriptionWrapper);

		// Wide
		const modalWideCheckboxWrapper = document.createElement('div');
		modalWideCheckboxWrapper.classList.add('image-modal__form-group');
		const modalWideCheckboxLabel = document.createElement('label');
		modalWideCheckboxLabel.textContent = 'Широкоформатное изображения:';
		const modalWideCheckbox = document.createElement('input');
		modalWideCheckbox.id = 'js-image-modal-wide-checkbox';
		modalWideCheckbox.type = 'checkbox';
		if(this.img.classList.contains('is-wide')) {
			modalWideCheckbox.checked = true;
		}
		const modalWideCheckboxInputLabel = document.createElement('label');
		modalWideCheckboxInputLabel.setAttribute('for', 'js-image-modal-wide-checkbox');
		modalWideCheckboxInputLabel.textContent = 'Растянуть по ширине';

		modalWideCheckboxWrapper.appendChild(modalWideCheckboxLabel);
		modalWideCheckboxWrapper.appendChild(modalWideCheckbox);
		modalWideCheckboxWrapper.appendChild(modalWideCheckboxInputLabel);
		modalContent.appendChild(modalWideCheckboxWrapper);

		// Save button
		const modalButtonSave = document.createElement('button');
		modalButtonSave.type = 'button';
		modalButtonSave.textContent = 'Сохранить';
		modalButtonSave.classList.add('image-modal__button-save');
		modalContent.appendChild(modalButtonSave);

		/**
		 * Append modal to body;
		 */
		modal.appendChild(modalContent);
    	document.querySelector('body').appendChild(modal);

		/**
		 * Close button;
		 */
		modalCloseButton.addEventListener('click', function() {
			document.querySelector('body').removeChild(modal);
		});

		/**
		 * Save modal;
		 */
		modalButtonSave.addEventListener('click', function() {
			self._saveModalChanges(
				modalInputAlt.value,
				modalInputDescriptionTextarea.value,
				modalWideCheckbox.checked,
				modal
			);
		});
	};

	_saveModalChanges = (altText, descriptionText, isWide, modal) => {
		this.img.alt = altText;
		this.img.setAttribute('data-description', descriptionText);
		if (isWide) {
			this.img.classList.add('is-wide');
		} else {
			this.img.classList.remove('is-wide');
		}
		document.querySelector('body').removeChild(modal);
	};

    _selectButton = (button, idx) => {
    	if (idx && idx !== 3) {
			button.style.filter = 'invert(20%)';
		}
    };

}
