<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\DockerImageVerifier as DockerImageVerifierContract;
use App\Agents\Data\DockerImageRecordData;
use App\Files\Contracts\Files;
use App\Files\Exceptions\FileJsonInvalid;
use App\Files\Values\FilePath;

/**
 * Answers from docs/accounts/docker-images.json, which the image build script writes: an image is verified only when
 * it is recorded there as the agent image, by digest, which the script does once every check passed.
 * With no record yet, none is.
 */
final readonly class DockerImageVerifier implements DockerImageVerifierContract
{
    public function __construct(private Files $files, private FilePath $record) {}

    /**
     * @throws FileJsonInvalid when the record exists but is not valid JSON
     */
    public function isVerified(string $reference): bool
    {
        if (! $this->files->exists($this->record)) {
            return false;
        }

        return DockerImageRecordData::from($this->files->readJson($this->record))->hasAgentImage($reference);
    }
}
