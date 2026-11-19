<?php

declare(strict_types=1);

namespace App\Processes\Values;

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
        /**
         * @var array{samples: list<array{file: string, exit: int, proves: string}>} $manifest
         */
        $manifest = json_decode((string) file_get_contents("{$this->proofFolder()}/manifest.json"), true);

        return array_map(ProofSample::fromArray(...), $manifest['samples']);
    }

    /**
     * The bytes a sample's run printed.
     */
    public function outputOf(ProofSample $sample): string
    {
        return (string) file_get_contents("{$this->proofFolder()}/{$sample->file}");
    }
}
