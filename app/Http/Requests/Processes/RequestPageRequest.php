<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The command request a review page shows, named by its address.
 */
final class RequestPageRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function requestId(): string
    {
        return (string) $this->route('request');
    }
}
