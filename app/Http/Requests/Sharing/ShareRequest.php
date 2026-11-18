<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsShareId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The share the owner's detail page or reveal action names, and the audit page the detail shows.
 */
final class ShareRequest extends FormRequest
{
    use ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['auditAfter' => ['nullable', 'string', 'ulid']];
    }

    /**
     * The audit row the shown audit page starts after, or none for the newest.
     */
    public function auditAfter(): string|null
    {
        return $this->filled('auditAfter') ? $this->string('auditAfter')->toString() : null;
    }
}
