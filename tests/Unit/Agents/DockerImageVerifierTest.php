<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Files\Contracts\Files;
use App\Support\DockerImageVerifier;
use Tests\TestCase;

final class DockerImageVerifierTest extends TestCase
{
    public function test_only_the_verified_agent_image_of_the_record_is_verified(): void
    {
        $verifier = $this->verifier($this->record([
            $this->image('agent', 'journal-runner@sha256:aaa'),
            $this->image('runner', 'journal-runner@sha256:bbb'),
        ]));

        $this->assertTrue($verifier->isVerified('journal-runner@sha256:aaa'));
        $this->assertFalse($verifier->isVerified('journal-runner@sha256:bbb'));
        $this->assertFalse($verifier->isVerified('journal-runner@sha256:ccc'));
    }

    public function test_no_image_is_verified_before_the_build_wrote_a_record(): void
    {
        $verifier = $this->verifier(sys_get_temp_dir().'/no-docker-images-'.uniqid().'.json');

        $this->assertFalse($verifier->isVerified('journal-runner@sha256:aaa'));
    }

    private function verifier(string $recordPath): DockerImageVerifier
    {
        $files = $this->app->make(Files::class);

        return new DockerImageVerifier($files, $files->filePathOf($recordPath));
    }

    /**
     * @param  list<array<string, string>>  $images
     */
    private function record(array $images): string
    {
        $path = (string) tempnam(sys_get_temp_dir(), 'docker-images');
        file_put_contents($path, json_encode(['note' => 'test', 'images' => $images], JSON_THROW_ON_ERROR));

        return $path;
    }

    /**
     * @return array<string, string>
     */
    private function image(string $name, string $reference): array
    {
        return [
            'name' => $name,
            'architecture' => 'linux/arm64',
            'reference' => $reference,
            'claude_code' => '2.1.323',
            'codex' => '0.165.0',
            'built_at' => '2026-11-20T21:37:10+00:00',
        ];
    }
}
