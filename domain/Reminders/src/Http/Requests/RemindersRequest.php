<?php

declare(strict_types=1);

namespace Domain\Reminders\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The reminders window's address: which page of reminders it shows.
 */
final class RemindersRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['page' => ['nullable', 'integer', 'min:1']];
    }

    public function pageNumber(): int
    {
        return $this->integer('page', 1);
    }
}
