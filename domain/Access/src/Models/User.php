<?php

declare(strict_types=1);

namespace Domain\Access\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Concerns\TakesPartInMessages;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Messages\MessageReceiver;
use App\Contracts\Messages\MessageSender;
use App\Contracts\Questions\AnswersQuestions;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Inboxes\InboxMember;
use App\Support\AssigneeIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Passkeys\Passkey;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property ?Carbon $email_verified_at
 * @property mixed $password
 * @property ?string $two_factor_secret
 * @property ?string $two_factor_recovery_codes
 * @property ?Carbon $two_factor_confirmed_at
 * @property ?CarbonImmutable $disabled_at
 * @property ?string $remember_token
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property Collection<int, InboxMember>|InboxMember[] $inboxMemberships
 * @property Collection<int, DatabaseNotification>|DatabaseNotification[] $notifications
 * @property Collection<int, Passkey>|Passkey[] $passkeys
 * @property Collection<int, DatabaseNotification>|DatabaseNotification[] $readNotifications
 * @property Collection<int, DatabaseNotification>|DatabaseNotification[] $unreadNotifications
 */
#[UseFactory(UserFactory::class)]
#[Hidden([
    'password',
    'two_factor_secret',
    'two_factor_recovery_codes',
    'remember_token',
])]
class User extends Authenticatable implements
    AnswersQuestions,
    Assignee,
    MessageReceiver,
    MessageSender,
    MustVerifyEmail,
    PasskeyUser,
    ReadableModel
{
    use BoundedReads;

    /**
     * @use HasFactory<UserFactory>
     */
    use HasFactory;

    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;
    use Notifiable;
    use PasskeyAuthenticatable;
    use TakesPartInMessages;
    use TwoFactorAuthenticatable;

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
            'disabled_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new user with a name, an email and a password the hashed cast hashes.
     */
    public static function create(string $name, string $email, string $password): self
    {
        $user = new self();
        $user->name = $name;
        $user->email = $email;
        $user->password = $password;
        $user->save();

        return $user;
    }

    // ----------[ Mutations ]----------

    /**
     * Disables the account: it is never admitted again until it is enabled.
     */
    public function disable(CarbonImmutable $at): void
    {
        $this->disabled_at = $at;
        $this->save();
    }

    public function enable(): void
    {
        $this->disabled_at = null;
        $this->save();
    }

    /**
     * Stores a new password; the hashed cast hashes it.
     */
    public function changePassword(string $password): void
    {
        $this->password = $password;
        $this->save();
    }

    // ----------[ Predicates ]----------

    public function isDisabled(): bool
    {
        return $this->disabled_at !== null;
    }

    // ----------[ Transformers ]----------

    public function assigneeIdentity(): AssigneeIdentity
    {
        return AssigneeIdentity::of($this);
    }

    public function actorType(): ActorType
    {
        return ActorType::User;
    }

    // ----------[ Calculations ]----------

    public function actorId(): string
    {
        return $this->id;
    }

    // ----------[ Queries ]----------

    /**
     * The installation's owner account, made the first time and found by its email after that.
     */
    public static function installOwner(string $name, string $email, string $password): self
    {
        $owner = new self();
        $owner->name = $name;
        $owner->email = $email;
        $owner->password = $password;
        $owner->setAttribute($owner->getKeyName(), $owner->newUniqueId());

        // The inserted row is returned as it is, so its caller sees wasRecentlyCreated; an owner already there is read.
        if ($owner->insertIfAbsent()) {
            return $owner;
        }

        return self::query()->withEmail($email)->sole();
    }

    /**
     * The id of the user with this email address, the journal's owner; none when no such user exists yet.
     */
    public static function ownerIdFor(string $email): string|null
    {
        $id = self::query()->withEmail($email)->value('id');

        if (is_string($id)) {
            return $id;
        }

        return null;
    }

    // ----------[ Scopes ]----------

    /**
     * The user of that email address.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withEmail(Builder $query, string $email): void
    {
        $query->where('email', $email);
    }
}
