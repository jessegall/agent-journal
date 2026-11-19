"""The variables a mysql or postgres client reads itself, built from a login secret's fields."""

from journal.features.secrets.support.client_variables import ClientVariables

FIELDS = {"host": "db.example", "port": "3306", "database": "app", "username": "reader", "password": "pw\"1"}


def test_mysql_gets_host_port_and_password_in_variables_and_the_user_in_a_defaults_file():
    client = ClientVariables("mysql", FIELDS)
    assert client.applies()
    assert client.environment() == {"MYSQL_HOST": "db.example", "MYSQL_TCP_PORT": "3306", "MYSQL_PWD": "pw\"1"}
    assert client.defaults_file() == '[client]\nuser="reader"\n[mysql]\ndatabase="app"\n'
    assert "pw" not in client.defaults_file()


def test_mysqldump_takes_the_same_mapping():
    assert ClientVariables("mysqldump", FIELDS).environment()["MYSQL_PWD"] == FIELDS["password"]


def test_postgres_clients_get_every_part_in_variables_and_no_file():
    for program in ("psql", "pg_dump"):
        client = ClientVariables(program, FIELDS)
        assert client.environment() == {"PGHOST": "db.example", "PGPORT": "3306", "PGDATABASE": "app", "PGUSER": "reader", "PGPASSWORD": "pw\"1"}
        assert client.defaults_file() is None


def test_aliases_and_missing_parts():
    client = ClientVariables("psql", {"hostname": "h", "user": "u", "pass": "p"})
    assert client.environment() == {"PGHOST": "h", "PGUSER": "u", "PGPASSWORD": "p"}


def test_other_programs_and_unrelated_fields_get_nothing():
    assert not ClientVariables("curl", FIELDS).applies()
    assert not ClientVariables("mysql", {"key": "x"}).applies()
