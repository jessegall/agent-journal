<?php

declare(strict_types=1);

namespace App\Agents\Readers;

use App\Agents\Contracts\HelperImages;
use JsonException;

/**
 * Answers from docs/accounts/helper-image.json, which the image build script writes: an image is verified only when
 * it is recorded there by digest with the status verified. With no record written yet, no image is verified.
 */
final readonly class VerifiedHelperImages implements HelperImages
{
    public function __construct(private string $recordPath) {}

    /**
     * @throws JsonException when the record exists but is not valid JSON
     */
    public function isVerified(string $imageReference): bool
    {
        if (! is_file($this->recordPath)) {
            return false;
        }

        $record = json_decode((string) file_get_contents($this->recordPath), true, 8, JSON_THROW_ON_ERROR);

        foreach ($record['images'] ?? [] as $image) {
            if (($image['reference'] ?? null) === $imageReference && ($image['status'] ?? null) === 'verified') {
                return true;
            }
        }

        return false;
    }
}
