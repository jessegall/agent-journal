<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The text of a new document or report. The limits are checked by MarkdownText in the command; this only asks for
 * the three strings.
 */
final class CreateRecordRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string'],
            'abstract' => ['required', 'string'],
            'body' => ['required', 'string'],
        ];
    }

    public function title(): string
    {
        return $this->string('title')->toString();
    }

    public function abstract(): string
    {
        return $this->string('abstract')->toString();
    }

    public function body(): string
    {
        return (string) $this->input('body');
    }
}
