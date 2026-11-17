<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Home's own query: the agent session the chat window and the sections beside it read. Each window validates its own
 * part, window[<key>], with its own request.
 */
final class HomeRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'session' => ['nullable', 'string', 'regex:/^[1-9][0-9]{0,18}$/'],
        ];
    }
}
