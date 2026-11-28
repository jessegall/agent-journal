<?php

declare(strict_types=1);

namespace App\Http\Requests\Text;

use App\Http\Requests\Concerns\ReadsOptionalText;
use App\Http\Requests\RecordTargetRequest;

/**
 * Which version of a record's text to describe: the one named, or the current one.
 */
final class TextVersionRequest extends RecordTargetRequest
{
    use ReadsOptionalText;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'target' => $this->targetRules(),
            'version' => [
                'nullable',
                'string',
                'max:64',
            ],
        ];
    }

    public function version(): string|null
    {
        return $this->optionalText('version');
    }
}
