<?php

declare(strict_types=1);

namespace Domain\Access\Models;

use App\Actors\Contracts\MessageRecipient;
use App\Actors\Contracts\MessageSender;
use App\Actors\Contracts\SeatedActor;
use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Support\AssigneeIdentity;
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
 * A user who can sign in. Only the configured owner gets into the journal (OwnerAdmission).
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
#[UseFactory(UserFactory::class)]
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements
    Assignee,
    MessageRecipient,
    MessageSender,
    MustVerifyEmail,
    PasskeyUser,
    ReadableModel,
    SeatedActor
{
    use BoundedReads;

    /**
     * @use HasFactory<UserFactory>
     */
    use HasFactory;

    use HasUlids;
    use Linkable;
    use Notifiable;
    use PasskeyAuthenticatable;
    use TwoFactorAuthenticatable;

    // ----------[ Constructors ]----------

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

    /**
     * A new user with a name, an email and a password the hashed cast hashes.
     */
    public static function register(string $name, string $email, string $password): self
    {
        return self::query()->create(['name' => $name, 'email' => $email, 'password' => $password]);
    }

    // ----------[ Queries ]----------

    /**
     * The installation's owner account, made the first time and found by its email after that.
     */
    public static function installOwner(string $name, string $email, string $password): self
    {
        return self::query()->firstOrCreate(['email' => $email], ['name' => $name, 'password' => $password]);
    }

    /**
     * The id of the user with this email address, the journal's owner; none when no such user exists yet.
     */
    public static function ownerIdFor(string $email): string|null
    {
        $id = self::query()->where('email', $email)->value('id');

        return is_string($id) ? $id : null;
    }

    // ----------[ Mutations ]----------

    /**
     * Stores a new password; the hashed cast hashes it.
     */
    public function changePassword(string $password): void
    {
        $this->password = $password;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function assigneeIdentity(): AssigneeIdentity
    {
        return AssigneeIdentity::of($this);
    }

    public function actorType(): ActorType
    {
        return ActorType::User;
    }

    public function actorId(): string
    {
        return $this->id;
    }
}
