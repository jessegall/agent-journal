<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * A session policy stored with attachable before its rename keeps the value under isAttachable.
 */
final class StoredAttachableKeyTest extends TestCase
{
    private const string MIGRATION = 'database/migrations/2026_11_27_000001_rename_attachable_in_stored_execution_policies.php';

    public function test_a_stored_policy_keeps_its_attachable_value_under_the_new_key(): void
    {
        $id = (string) Str::ulid();
        DB::table('session_policies')->insert([
            'id' => $id,
            'session_id' => (string) Str::ulid(),
            'access_policy' => '{}',
            'stop_conditions' => '{}',
            'execution_policy' => json_encode(['mode' => 'required_container', 'attachable' => true], JSON_THROW_ON_ERROR),
            'policy_digest' => str_repeat('a', 64),
        ]);

        (require base_path(self::MIGRATION))->up();

        $stored = json_decode((string) DB::table('session_policies')->where('id', $id)->value('execution_policy'), true, 4, JSON_THROW_ON_ERROR);
        $this->assertTrue($stored['isAttachable']);
        $this->assertArrayNotHasKey('attachable', $stored);
        $this->assertSame('required_container', $stored['mode']);
    }
}
