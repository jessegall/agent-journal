// Core's text routes and the comment place helpers, which a domain's components import as @kit/TextComments.
export { read, sections, version } from '@/routes/text';
export { describeRange, subjectFields, type CommentSubject, type TextRangeChoice } from '@/components/text/textRange';
export { renderedLineRange } from '@/components/text/useRenderedSelection';
