<?php

declare(strict_types=1);

namespace Domain\Access\Models;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\Assignee;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Access\Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * A user who can sign in. Only the configured owner gets into the journal (JournalAccess).
 *
 * @property string $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
#[UseFactory(UserFactory::class)]
class User extends Authenticatable implements Assignee, MustVerifyEmail, PasskeyUser, ReadableModel
{
    use BoundedReads;

    /**
     * @use HasFactory<UserFactory>
     */
    use HasFactory, HasUlids, Linkable, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function actorType(): ActorType
    {
        return ActorType::User;
    }

    public function actorId(): string
    {
        return $this->id;
    }

    /**
     * Stores a new password; the hashed cast hashes it.
     */
    public function changePassword(string $password): void
    {
        $this->password = $password;
        $this->save();
    }

    /**
     * The id of the user with this email address, the journal's owner; none when no such user exists yet.
     */
    public static function ownerIdFor(string $email): string|null
    {
        $id = self::query()->where('email', $email)->value('id');

        return is_string($id) ? $id : null;
    }
}
