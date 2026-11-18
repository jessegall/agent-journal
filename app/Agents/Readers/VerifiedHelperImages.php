<?php

declare(strict_types=1);

namespace App\Agents\Readers;

use App\Agents\Contracts\HelperImages;
use JsonException;

/**
 * Answers from docs/accounts/helper-image.json, which the image build script writes: an image is verified only when
 * it is recorded there by digest with the status verified.
 */
final readonly class VerifiedHelperImages implements HelperImages
{
    public function __construct(private string $recordPath) {}

    public function isVerified(string $imageReference): bool
    {
        try {
            $record = json_decode((string) file_get_contents($this->recordPath), true, 8, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return false;
        }

        foreach ($record['images'] ?? [] as $image) {
            if (($image['reference'] ?? null) === $imageReference && ($image['status'] ?? null) === 'verified') {
                return true;
            }
        }

        return false;
    }
}
