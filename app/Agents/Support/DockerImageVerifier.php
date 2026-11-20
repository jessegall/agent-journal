<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\DockerImageVerifier as DockerImageVerifierContract;
use App\Agents\Data\DockerImageRecordData;
use JsonException;

/**
 * Answers from docs/accounts/docker-images.json, which the image build script writes: an image is verified only when
 * it is recorded there as the agent image, by digest, which the script does once every check passed.
 * With no record yet, none is.
 */
final readonly class DockerImageVerifier implements DockerImageVerifierContract
{
    public function __construct(private string $recordPath) {}

    /**
     * @throws JsonException when the record exists but is not valid JSON
     */
    public function isVerified(string $reference): bool
    {
        if (! is_file($this->recordPath)) {
            return false;
        }

        return DockerImageRecordData::from(
            json_decode((string) file_get_contents($this->recordPath), true, 8, JSON_THROW_ON_ERROR),
        )->hasAgentImage($reference);
    }
}
