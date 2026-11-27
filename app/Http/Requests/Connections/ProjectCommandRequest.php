<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A connected machine's journal verb: the request id that keeps it from running twice, the binding it runs for, the
 * arguments as typed after journal, and what was piped into it.
 */
final class ProjectCommandRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'request_key' => [
                'required',
                'string',
                'max:64',
                'regex:/^[A-Za-z0-9_-]+$/',
            ],
            'binding' => [
                'required',
                'string',
                'ulid',
            ],
            'argv' => [
                'required',
                'array',
                'min:1',
                'max:200',
            ],
            'argv.*' => [
                'string',
                'max:8192',
            ],
            'stdin' => [
                'present',
                'nullable',
                'string',
                'max:1048576',
            ],
        ];
    }

    public function requestKey(): string
    {
        return $this->string('request_key')->toString();
    }

    public function bindingId(): string
    {
        return $this->string('binding')->toString();
    }

    /**
     * @return list<string>
     */
    public function argv(): array
    {
        return array_values(array_map(strval(...), $this->array('argv')));
    }

    public function stdin(): string
    {
        return $this->string('stdin')->toString();
    }

    /**
     * The verb as artisan names it: the subject and the verb, joined by a colon.
     */
    public function verbName(): string
    {
        return implode(':', array_slice($this->argv(), 0, 2));
    }

    /**
     * Whether the terminal asks for its overview: the one word overview, nothing piped in.
     */
    public function isOverview(): bool
    {
        return $this->argv() === ['overview'] && ! $this->filled('stdin');
    }
}
