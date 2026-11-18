<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The ended runs whose stored output is to be removed, and whether only to preview what goes.
 */
final class CleanOutputRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'runs' => ['required', 'array', 'list', 'min:1', 'max:100'],
            'runs.*' => ['string', 'max:26'],
            'preview' => ['required', 'boolean'],
        ];
    }

    /**
     * @return list<string>
     */
    public function runIds(): array
    {
        /** @var list<string> $runs */
        $runs = $this->validated('runs');

        return $runs;
    }

    public function previewOnly(): bool
    {
        return $this->boolean('preview');
    }
}
