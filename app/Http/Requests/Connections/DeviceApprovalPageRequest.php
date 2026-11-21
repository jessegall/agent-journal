<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The device code the owner opens to approve.
 */
final class DeviceApprovalPageRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function userCode(): string
    {
        return (string) $this->route('code');
    }
}
