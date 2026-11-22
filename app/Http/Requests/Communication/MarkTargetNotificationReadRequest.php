<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use Illuminate\Foundation\Http\FormRequest;

final class MarkTargetNotificationReadRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'targetKey' => ['required', 'string', 'max:64'],
            'targetId' => ['required', 'string', 'max:64'],
        ];
    }

    public function command(): MarkTargetNotificationReadCommand
    {
        return new MarkTargetNotificationReadCommand(
            $this->string('targetKey')->toString(),
            $this->string('targetId')->toString(),
        );
    }
}
