<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Requests;

use App\Contracts\Records\RecordResolver;
use App\Enums\Records\TextAnchorType;
use App\Http\Requests\RecordTargetRequest;
use App\Values\TextRange;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Illuminate\Validation\Validator;

/**
 * A new comment: its record, its text, its submission key and, only for a text comment, the version and place it
 * points at. No anchor field means the whole record; a mixed or partial set is refused, and no author or session is
 * ever taken from the request.
 */
final class PostCommentRequest extends RecordTargetRequest
{
    private const array ANCHOR_FIELDS = [
        'version',
        'section',
        'first_line',
        'last_line',
        'quote',
        'start_offset',
        'end_offset',
    ];

    /**
     * The exact anchor fields each kind of place is given with.
     */
    private const array FIELDS_OF_TYPE = [
        'section' => ['version', 'section'],
        'lines' => ['version', 'first_line', 'last_line'],
        'quote' => ['version', 'first_line', 'last_line', 'quote', 'start_offset', 'end_offset'],
    ];

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'target' => $this->targetRules(),
            'body' => ['required', 'string'],
            'submission_key' => ['required', 'uuid'],
            'author' => ['prohibited'],
            'author_id' => ['prohibited'],
            'session' => ['prohibited'],
            'version' => ['nullable', 'string', 'max:64'],
            'section' => ['nullable', 'integer', 'min:1'],
            'first_line' => ['nullable', 'integer', 'min:1'],
            'last_line' => ['nullable', 'integer', 'min:1'],
            'quote' => ['nullable', 'string'],
            'start_offset' => ['nullable', 'integer', 'min:0'],
            'end_offset' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @return list<callable(Validator): void>
     */
    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($this->givenAnchorFields() !== []
                && ! in_array($this->givenAnchorFields(), self::FIELDS_OF_TYPE, true)) {
                $validator->errors()->add(
                    'version',
                    'Point at the whole record (no place), or at one section, one span of lines, or one quote with its version.',
                );
            }
        }];
    }

    public function body(): string
    {
        return $this->string('body')->toString();
    }

    public function submissionKey(): string
    {
        return $this->string('submission_key')->toString();
    }

    /**
     * The command for the comment asked for: about the whole record when no anchor field is given, otherwise about
     * the one place the fields describe.
     */
    public function command(RecordResolver $records): PostCommentCommand|PostTextCommentCommand
    {
        $target = $this->target($records);

        if ($this->givenAnchorFields() === []) {
            return new PostCommentCommand($target, $this->body(), $this->submissionKey());
        }

        return new PostTextCommentCommand(
            $target,
            $this->body(),
            $this->range(
                TextAnchorType::from((string) array_search($this->givenAnchorFields(), self::FIELDS_OF_TYPE, true)),
            ),
            $this->submissionKey(),
        );
    }

    private function range(TextAnchorType $type): TextRange
    {
        $version = $this->string('version')->toString();

        return match ($type) {
            TextAnchorType::Section => TextRange::section($version, $this->integer('section')),
            TextAnchorType::Lines => TextRange::lines(
                $version,
                $this->integer('first_line'),
                $this->integer('last_line'),
            ),
            TextAnchorType::Quote => TextRange::quote(
                $version,
                $this->integer('first_line'),
                $this->integer('last_line'),
                $this->string('quote')->toString(),
                $this->integer('start_offset'),
                $this->integer('end_offset'),
            ),
        };
    }

    /**
     * The anchor fields the request fills, in their fixed order.
     *
     * @return list<string>
     */
    private function givenAnchorFields(): array
    {
        return array_values(array_filter(self::ANCHOR_FIELDS, fn (string $field) => $this->filled($field)));
    }
}
