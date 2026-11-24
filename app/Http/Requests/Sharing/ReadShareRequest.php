<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use Illuminate\Foundation\Http\FormRequest;

/**
 * One public share request: the token and the path after it from the route, and where a page of children goes on.
 */
final class ReadShareRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'cursor' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function token(): string
    {
        return (string) $this->route('token');
    }

    public function sharePath(): string
    {
        return (string) ($this->route('path') ?? '');
    }

    public function cursor(): string|null
    {
        if ($this->filled('cursor')) {
            return $this->string('cursor')->toString();
        }

        return null;
    }

    public function wantsHeadOnly(): bool
    {
        return $this->isMethod('HEAD');
    }
}
