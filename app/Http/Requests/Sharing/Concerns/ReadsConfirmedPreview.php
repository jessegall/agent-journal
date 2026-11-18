<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing\Concerns;

/**
 * The saved preview the owner confirms, by its id and checksum.
 */
trait ReadsConfirmedPreview
{
    /**
     * @return array<string, list<string>>
     */
    protected function confirmedPreviewRules(): array
    {
        return [
            'previewId' => ['required', 'string', 'ulid'],
            'previewChecksum' => ['required', 'string', 'size:64'],
        ];
    }

    public function previewId(): string
    {
        return $this->string('previewId')->toString();
    }

    public function previewChecksum(): string
    {
        return $this->string('previewChecksum')->toString();
    }
}
