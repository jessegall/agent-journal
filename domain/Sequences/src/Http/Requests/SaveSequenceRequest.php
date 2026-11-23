<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Requests;

use Domain\Sequences\Values\SequenceStep;
use Illuminate\Foundation\Http\FormRequest;

/**
 * What the sequence editor saves: the name, the version it opened when it edits one, and the steps in order, each
 * with its id, title, when it runs and when it is done.
 */
final class SaveSequenceRequest extends FormRequest
{
    public const int TEXT_CHARACTER_LIMIT = 255;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        $text = ['required', 'string', 'max:'.self::TEXT_CHARACTER_LIMIT];

        return [
            'name' => $text,
            'version' => ['nullable', 'integer', 'min:1'],
            'steps' => ['present', 'array'],
            'steps.*.id' => $text,
            'steps.*.title' => $text,
            'steps.*.runs_when' => $text,
            'steps.*.done_when' => $text,
        ];
    }

    public function name(): string
    {
        return $this->string('name')->toString();
    }

    public function openedVersion(): int
    {
        return $this->integer('version');
    }

    /**
     * @return list<SequenceStep>
     */
    public function steps(): array
    {
        return array_values(array_map(
            fn (array $step) => new SequenceStep(
                (string) $step['id'],
                (string) $step['title'],
                (string) $step['runs_when'],
                (string) $step['done_when'],
            ),
            $this->array('steps'),
        ));
    }
}
