<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The new-sequence editor's address, which may carry a guided draft to start from: a name, the steps one per line,
 * when each is done, and who drafted it. Nothing of it is saved until the editor is sent.
 */
final class NewSequenceRequest extends FormRequest
{
    private const int STEPS_CHARACTER_LIMIT = 4000;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        $text = ['nullable', 'string', 'max:'.SaveSequenceRequest::TEXT_CHARACTER_LIMIT];

        return [
            'name' => $text,
            'steps' => ['nullable', 'string', 'max:'.self::STEPS_CHARACTER_LIMIT],
            'doneWhen' => $text,
            'draftedBy' => $text,
        ];
    }

    public function name(): string
    {
        return $this->string('name')->trim()->toString();
    }

    /**
     * The drafted steps' titles, one per line, blank lines left out.
     *
     * @return list<string>
     */
    public function stepTitles(): array
    {
        return array_values(array_filter(
            array_map(trim(...), explode("\n", $this->string('steps')->toString())),
            fn (string $title) => $title !== '',
        ));
    }

    public function doneWhen(): string
    {
        return $this->string('doneWhen')->trim()->toString();
    }

    public function draftedBy(): string
    {
        return $this->string('draftedBy')->trim()->toString();
    }
}
