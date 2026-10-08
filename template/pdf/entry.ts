import '#srl-target-entry'
import * as Awesomizr from '@simple-reporting/core/pdf/Awesomizr.js'
import PDFNotes from '@simple-reporting/core/pdf/PDFNotes'
import PDFNestedContainers from '@simple-reporting/core/pdf/PDFNestedContainers'
import PDFSetPageNumbers from '@simple-reporting/core/pdf/PDFSetPageNumbers'

document.addEventListener('DOMContentLoaded', () => {
  new PDFNotes({ noteClass: '.srl-category-notes_group, .srl-category-notes_holding' })
  new PDFNestedContainers({ selector: '.srl-nested-container' })
  new PDFSetPageNumbers({
    tocItemClass: '.srl-pdf-toc__item:not(.srl-pdf-toc__item--blank)',
    tocItemPageNumberClass: '.srl-pdf-toc__page-number',
  })
})
void Awesomizr
