<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsShareId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The share the owner's detail page or reveal action names, the tab the detail shows and the audit page it shows.
 */
final class ShareRequest extends FormRequest
{
    use ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'auditAfter' => ['nullable', 'string', 'ulid'],
            'tab' => ['nullable', 'string', 'max:40'],
        ];
    }

    /**
     * The tab of the detail the window chose; none chooses the first.
     */
    public function chosenTab(): string
    {
        return $this->string('tab')->toString();
    }

    /**
     * The audit row the shown audit page starts after, or none for the newest.
     */
    public function auditAfter(): string|null
    {
        return $this->filled('auditAfter') ? $this->string('auditAfter')->toString() : null;
    }
}
