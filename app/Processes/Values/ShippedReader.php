<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Files\Support\CodeFiles;
use App\Processes\Data\ProofManifestData;

/**
 * A reader Core ships for one tool, bound to the version its samples came from: the core rule it approves, where that
 * version is read, the invocation it reads, its reader, its output contract and its exit map; the samples sit in
 * Rules/Proofs/<tool>/<version>.
 */
final readonly class ShippedReader
{
    public function __construct(
        public string $tool,
        public string $operation,
        public string $version,
        public string $versionSource,
        public string $invocation,
        public ReaderDefinition $reader,
        public OutputContract $contract,
        public ExitPolicy $exits,
    ) {}

    public function proofFolder(): string
    {
        return dirname(__DIR__)."/Rules/Proofs/{$this->tool}/{$this->version}";
    }

    /**
     * The samples its manifest lists, in order.
     *
     * @return list<ProofSample>
     */
    public function samples(): array
    {
        return ProofManifestData::from(
            json_decode($this->proofFile('manifest.json'), true, 512, JSON_THROW_ON_ERROR),
        )->samples;
    }

    /**
     * The bytes a sample's run printed.
     */
    public function outputOf(ProofSample $sample): string
    {
        return $this->proofFile($sample->file);
    }

    /**
     * A file of the shipped proof folder, part of the project's code and read once per process.
     */
    private function proofFile(string $name): string
    {
        $code = CodeFiles::ofProcess();

        return $code->file($code->projectPathOf("{$this->proofFolder()}/{$name}"));
    }
}
