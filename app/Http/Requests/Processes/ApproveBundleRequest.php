<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The module bundle an owner activates: its module, version and the exact digest they reviewed.
 */
final class ApproveBundleRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'module' => ['required', 'string', 'max:255'],
            'version' => ['present', 'nullable', 'string', 'max:255'],
            'digest' => ['required', 'string', 'size:64'],
        ];
    }

    public function module(): string
    {
        return $this->string('module')->toString();
    }

    public function moduleVersion(): string
    {
        return $this->string('version')->toString();
    }

    public function digest(): string
    {
        return $this->string('digest')->toString();
    }
}
