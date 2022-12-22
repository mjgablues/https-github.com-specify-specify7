
import unittest

from django.db import transaction

from specifyweb.specify import models
from specifyweb.specify.api_tests import ApiTests
from ..exceptions import BusinessRuleException

class AgentTests(ApiTests):
    def test_agent_delete_cascades(self):
        agent = models.Agent.objects.create(
            agenttype=0,
            firstname="Test",
            lastname="Agent",
            division=self.division,)

        agent.addresses.create(address="somewhere")

        geography = models.Geography.objects.create(
            name="Earth",
            definition=self.geographytreedef,
            definitionitem=self.geographytreedef.treedefitems.all()[0]
            )
        agent.agentgeographies.create(geography=geography)

        agent.agentspecialties.create(
            ordernumber=0,
            specialtyname="testing")

        agent.delete()

    def test_specifyuser_blocks_delete(self):
        agent = models.Agent.objects.create(
            agenttype=0,
            firstname="Test",
            lastname="Agent",
            division=self.division,
            specifyuser=self.specifyuser)

        with self.assertRaises(BusinessRuleException):
            agent.delete()

    def test_agent_without_specifyuser_can_be_deleted(self):
        agent = models.Agent.objects.create(
            agenttype=0,
            firstname="Test",
            lastname="Agent",
            division=self.division,
            specifyuser=None)

        agent.delete()

    @unittest.expectedFailure
    def test_agent_division_and_agenttype_cannot_be_null(self):
        with self.assertRaises(BusinessRuleException):
            models.Agent.objects.create(
                agenttype=0,
                firstname="Test",
                lastname="Agent",
                division=None)

        with self.assertRaises(BusinessRuleException):
            models.Agent.objects.create(
                agenttype=None,
                firstname="Test",
                lastname="Agent",
                division=self.division)

    # Temporarily removed while https://github.com/specify/specify7/issues/2518 is being resolved
    
    # def test_other_and_group_do_not_have_addresses(self):
    #     from specifyweb.specify.agent_types import agent_types
    #     agent = models.Agent.objects.create(
    #         agenttype=agent_types.index('Person'),
    #         firstname="Test",
    #         lastname="Agent",
    #         division=self.division)

    #     agent.addresses.create(address="somewhere")

    #     models.Address.objects.get(agent=agent)

    #     agent.agenttype = agent_types.index('Other')
    #     agent.save()

    #     with self.assertRaises(models.Address.DoesNotExist):
    #         models.Address.objects.get(agent=agent)

    #     agent.addresses.create(address="somewhere")

    #     models.Address.objects.get(agent=agent)

    #     agent.agenttype = agent_types.index('Group')
    #     agent.save()

    #     with self.assertRaises(models.Address.DoesNotExist):
    #         models.Address.objects.get(agent=agent)
