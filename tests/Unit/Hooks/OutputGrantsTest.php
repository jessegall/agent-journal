<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Exceptions\OutputGrantsInvalid;
use App\Hooks\Relay\OutputGrants;
use App\Hooks\Relay\OutputGrantSeal;
use Illuminate\Filesystem\Filesystem;
use PHPUnit\Framework\TestCase;

/**
 * A start's sealed output grants let it read exactly its own transcript, by real path: a link, a parent folder, a
 * snapshot sealed for another start or edited by hand grants nothing.
 */
final class OutputGrantsTest extends TestCase
{
    private string $base;

    private OutputGrantSeal $seal;

    protected function setUp(): void
    {
        parent::setUp();
        $this->base = (string) realpath(sys_get_temp_dir()).'/output-grants-'.bin2hex(random_bytes(4));
        mkdir($this->base.'/account/projects', 0o700, true);
        file_put_contents($this->base.'/account/projects/own.jsonl', '{}');
        file_put_contents($this->base.'/account/projects/foreign.jsonl', '{}');
        $this->seal = new OutputGrantSeal('base64:test-key');
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->base);
        parent::tearDown();
    }

    public function test_only_the_granted_file_is_readable(): void
    {
        $grants = OutputGrants::fromSnapshot($this->snapshot('start-1', [$this->base.'/account/projects/own.jsonl']),
            'start-1', $this->seal);

        $this->assertTrue($grants->allowsRead($this->base.'/account/projects/own.jsonl'));
        $this->assertFalse($grants->allowsRead($this->base.'/account/projects/foreign.jsonl'));
        $this->assertFalse($grants->allowsRead($this->base.'/account/projects'));
    }

    public function test_a_link_to_a_foreign_file_is_not_the_granted_file(): void
    {
        symlink($this->base.'/account/projects/foreign.jsonl', $this->base.'/looks-own.jsonl');
        $grants = OutputGrants::fromSnapshot($this->snapshot('start-1', [$this->base.'/looks-own.jsonl']),
            'start-1', $this->seal);

        $this->assertFalse($grants->allowsRead($this->base.'/looks-own.jsonl'));
    }

    public function test_a_snapshot_sealed_for_another_start_is_refused(): void
    {
        $this->expectException(OutputGrantsInvalid::class);

        OutputGrants::fromSnapshot($this->snapshot('start-2', [$this->base.'/account/projects/own.jsonl']),
            'start-1', $this->seal);
    }

    public function test_a_path_added_by_hand_breaks_the_seal(): void
    {
        $snapshot = json_decode($this->snapshot('start-1', [$this->base.'/account/projects/own.jsonl']), true);
        $snapshot['paths'][] = $this->base.'/account/projects/foreign.jsonl';

        $this->expectException(OutputGrantsInvalid::class);

        OutputGrants::fromSnapshot((string) json_encode($snapshot), 'start-1', $this->seal);
    }

    /**
     * @param  list<string>  $paths
     */
    private function snapshot(string $startKey, array $paths): string
    {
        return (string) json_encode([
            'generation' => 3,
            'paths' => $paths,
            'seal' => $this->seal->seal($startKey, 3, $paths),
        ]);
    }
}
