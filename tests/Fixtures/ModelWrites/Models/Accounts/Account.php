<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelWrites\Models\Accounts;

use Illuminate\Database\Eloquent\Model;

/**
 * The shape of the Profiles account: a locked read and a mutation that frees its writer.
 *
 * @property string|null $live_writer_attempt_id
 */
final class Account extends Model
{
    public static function lockedForJournal(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    public function endSignInAgain(SignInAttempt $attempt): void
    {
        $this->live_writer_attempt_id = null;
        $this->save();
    }
}
